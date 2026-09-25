"""S2 runner."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from care_pathway.slice_t2_ham.ham10000_loader import smoke

if __name__ == "__main__":
    print(smoke())
