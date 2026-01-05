#!/usr/bin/env python3
"""
Generate an image from the HTML pricing card.
Requires: pip install html2image playwright
"""

from html2image import Html2Image
import os

# Configure the output
hti = Html2Image()

# Generate the image
hti.screenshot(
    html_file='group-lesson-card.html',
    save_as='group-lesson-card.png',
    size=(400, 800)  # Width x Height in pixels
)

print("✅ Image generated: group-lesson-card.png")



