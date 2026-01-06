import os
import shutil

SOURCE_DIR = "Frames"
DEST_DIR = "public/frames"
OS_DEST_DIR = os.path.join(os.getcwd(), DEST_DIR)

if not os.path.exists(OS_DEST_DIR):
    os.makedirs(OS_DEST_DIR)

# Get files and sort them to ensure correct order
files = sorted([f for f in os.listdir(SOURCE_DIR) if f.startswith("ezgif-frame-") and f.endswith(".jpg")])

print(f"Found {len(files)} files in {SOURCE_DIR}")

for i, filename in enumerate(files):
    # Map 001 -> 0, 002 -> 1
    # New name: frame_{i}_delay-0.04s.jpg
    new_name = f"frame_{i}_delay-0.04s.webp"
    src_path = os.path.join(SOURCE_DIR, filename)
    dest_path = os.path.join(OS_DEST_DIR, new_name)
    shutil.copy(src_path, dest_path)
    # print(f"Copied {filename} to {new_name}")

print(f"Successfully processed {len(files)} frames to {DEST_DIR}")
