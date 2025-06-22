from pypdf import PdfReader


class PDFHelper:

    def __init__(self):
        pass

    def get_number_pages(self,reader):
        return len(reader.pages)
