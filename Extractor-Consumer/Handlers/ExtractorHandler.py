import os
import json
import pytesseract
from pdf2image import convert_from_path
from Publisher.ElasticQueuePublisher import publish_to_elastic_consumers
import re


def extract_pdf_ocr(pdf_path, poppler_path=None):
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found at path: {pdf_path}")

    try:
        images = convert_from_path(pdf_path, dpi=300, poppler_path=poppler_path)
        full_text = ""

        for page_number, image in enumerate(images, start=1):
            text = pytesseract.image_to_string(image)
            full_text += f"\n\n--- Page {page_number} ---\n{text.strip()}"

        return {
            "pdf_path": pdf_path,
            "raw_text": full_text
        }

    except Exception as e:
        print(f"[ERROR] OCR extraction failed: {e}")
        return {
            "pdf_path": pdf_path,
            "error": str(e)
        }


def split_cv_sections(text):

    sections = {
        "summary": "",
        "experience": "",
        "projects": "",
        "skills": "",
        "education": "",
        "certifications": "",
        "languages": "",
        "others": ""
    }

    section_patterns = {
        "summary": r"(summary|profile|objective)",
        "experience": r"(experience|employment|work history)",
        "projects": r"(projects|personal projects|project experience)",
        "skills": r"(skills|technical skills)",
        "education": r"(education|academic background)",
        "certifications": r"(certifications|courses|licenses)",
        "languages": r"(languages|spoken languages)"
    }

    lines = text.splitlines()
    current_section = "others"

    for line in lines:
        clean_line = line.strip()
        if not clean_line:
            continue

        lower_line = clean_line.lower()

        matched = False
        for section, pattern in section_patterns.items():
            if re.match(pattern, lower_line):
                current_section = section
                matched = True
                break

        sections[current_section] += clean_line + "\n"

    return sections


def extractor_handler(msg):
    try:

        parse_content = json.loads(msg)
        if not isinstance(parse_content, dict) or "path" not in parse_content:
            raise ValueError("Invalid message format. Must contain 'path' key.")

        pdf_path = parse_content["path"]
        print(f"[INFO] Processing PDF at: {pdf_path}")


        ocr_result = extract_pdf_ocr(pdf_path)
        raw_text = ocr_result.get("raw_text", "")


        structured_sections = split_cv_sections(raw_text)

        final_result = {
            "pdf_path": pdf_path,
            "sections": structured_sections
        }


        json_output_path = os.path.splitext(pdf_path)[0] + "_structured_cv.json"

        with open(json_output_path, "w") as outfile:
            json.dump(final_result, outfile, indent=2)

        print(f"[SUCCESS] Structured CV saved to: {json_output_path}")
        print(f'Publishing the Message to the Elastic Consumer')


        with open(json_output_path,'r',encoding='utf-8') as file:
            try:
                structured_json_data = json.load(file)
            except json.decoder.JSONDecodeError as json_error:
                print(f'Error Decoding the JSON: {json_error}')
                return


        json_queue_payload = json.dumps(structured_json_data)



        print(f'Publishing the Payload to the Elastic Consumer')
        publish_to_elastic_consumers(json_queue_payload)

        return True
    except Exception as error:
        print(f"[ERROR] Failed to handle PDF extraction: {error}")
        raise
