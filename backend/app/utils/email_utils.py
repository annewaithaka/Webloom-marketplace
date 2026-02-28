# app/utils/email_utils.py 
def send_verification_email(to_email: str, verify_url: str) -> None:
    # Dev mode: print the link so you can click it.
    print("\n==== EMAIL VERIFICATION (DEV MODE) ====")
    print(f"To: {to_email}")
    print(f"Verify: {verify_url}")
    print("=====================================\n")
