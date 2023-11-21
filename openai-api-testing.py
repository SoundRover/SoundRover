from openai import OpenAI
from dotenv import load_dotenv
import os

def test_openai_api(api_key):
    client = OpenAI()

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
        {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
    ]
    )

    print(completion.choices[0].message)



def main():
    # Path to your .env file
    env_path = './frontend/.env'

    # Load the environment variables from the .env file
    load_dotenv(dotenv_path=env_path)

    # Get the API key from the environment variable
    your_api_key = os.getenv('OPENAI_API_KEY').strip('"')
    print(your_api_key)

    test_openai_api(your_api_key)

if __name__ == "__main__":
    main()