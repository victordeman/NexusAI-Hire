import cProfile
import pstats
import asyncio
import io
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.models.llm import get_llm_response

async def profile_llm_call():
    print("Starting LLM call profiling...")
    messages = [{"role": "user", "content": "Tell me a short joke about software engineering."}]
    
    # We mock the actual LLM call if API keys are not set to avoid errors during profiling
    # but still profile the surrounding logic. 
    # For a real profile, ensure environment variables are set.
    
    try:
        response = await get_llm_response(messages)
        print(f"Response received: {response[:50]}...")
    except Exception as e:
        print(f"Error during LLM call: {e}")

def main():
    pr = cProfile.Profile()
    pr.enable()
    
    # Run the async function
    asyncio.run(profile_llm_call())
    
    pr.disable()
    s = io.StringIO()
    sortby = 'cumulative'
    ps = pstats.Stats(pr, stream=s).sort_stats(sortby)
    ps.print_stats(20)  # Print top 20 lines
    print(s.getvalue())

if __name__ == "__main__":
    main()
