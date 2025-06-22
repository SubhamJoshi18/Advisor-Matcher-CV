interface CVPayload {
  pdf_path: string;
  sections: {
    summary?: string;
    experience?: string;
    projects?: string;
    skills?: string;
    education?: string;
    certifications?: string;
    languages?: string;
    others?: string;
  };
}

export { CVPayload };
