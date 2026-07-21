import asyncio
import os
import sys

# Set env vars to ensure we have credentials if needed
from dotenv import load_dotenv
load_dotenv("backend/.env")

# We need to simulate the file upload and processing
from backend.app.services.rag_pipeline import process_document
from backend.app.services.storage_service import upload_file

import uuid
import base64

# A minimal valid PDF file (1 page, empty)
minimal_pdf_b64 = "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1DBSM/FzBwkC2OUgwqLgEyDIA1xIHCwplbmRzdHJlYW0KZW5kb2JqCgozIDAgb2JqCjQ0CmVuZG9iagoKNCAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSAxIDAgUj4+Pj4vQ29udGVudHMgMiAwIFIvUGFyZW50IDUgMCBSPj4KZW5kb2JqCgo1IDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzQgMCBSXT4+CmVuZG9iagoKMSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nPj4KZW5kb2JqCgo2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA1IDAgUj4+CmVuZG9iagoKNyAwIG9iago8PC9Qcm9kdWNlcihQREZsaWIgTGlnaHQgNy4wLjQpL0NyZWF0aW9uRGF0ZShEOjIwMDgxMTEyMTQ1NTIyKzAxJzAwJyk+PgplbmRvYmoKCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDI1MyAwMDAwMCBuIAowMDAwMDAwMDE5IDAwMDAwIG4gCjAwMDAwMDAxMzQgMDAwMDAgbiAKMDAwMDAwMDE1NSAwMDAwMCBuIAowMDAwMDAwMjQ5IDAwMDAwIG4gCjAwMDAwMDAzNDEgMDAwMDAgbiAKMDAwMDAwMDM5MCAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgOC9Sb290IDYgMCBSL0luZm8gNyAwIFIvSUQgWzwxZDNmNWU4YzM5Y2E3NmNlZmI1MTk4NWJmZjllNTdiYT48MWQzZjVlOGMzOWNhNzZjZWZiNTE5ODViZmY5ZTU3YmE+XT4+CnN0YXJ0eHJlZgo0OTQKJSVFT0YK"

async def test():
    try:
        doc_id = str(uuid.uuid4())
        file_name = f"{doc_id}_test.pdf"
        
        pdf_bytes = base64.b64decode(minimal_pdf_b64)
        
        with open("valid_test.pdf", "wb") as f:
            f.write(pdf_bytes)
            
        with open("valid_test.pdf", "rb") as f:
            file_data = f.read()
            file_size = len(file_data)
            f.seek(0)
            upload_file(file_name, f, file_size, "application/pdf")
            
        print(f"Uploaded test file {file_name}")
        
        # Add a dummy mock_document so it can be updated
        from backend.app.api.endpoints.documents import mock_documents
        mock_documents.append({"id": doc_id, "status": "Processing"})
        
        # Call process_document
        process_document(file_name, doc_id)
        
        print("Processing complete.")
        print(mock_documents)
    except Exception as e:
        print(f"Error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
