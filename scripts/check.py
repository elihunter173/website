#!/usr/bin/env python
"""
A linting script for the markdown on my website.
This outputs vim-quickfix formatted error
messages.

Requires
* mistune
"""

import argparse
import os

import mistune

def find_line(doc, line):
    for i, l in enumerate(doc.splitlines(), 1):
        if line in l:
            return i

class CheckRenderer(mistune.Renderer):
    """Renderer provided that checks markdown before rendering.

    `mistune` is a push parser rather than a pull-parser so to interact with it
    we need to provide a renderer. This renderer doesn't need to actually
    render anything, so we just return empty strings.
    """

    def block_code(self, code, lang):
        """Code cannot be more than 48 characters long or it looks bad"""
        for line in code.splitlines():
            if len(line) > 48:
                line_num = find_line(doc, line)
                print(f"{self.my_filename}:{line_num}:",
                        "codeblock exceeds 48 character line length")
        return ""

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("file", nargs="+", type=argparse.FileType("r"))
    args = parser.parse_args()

    renderer = CheckRenderer()
    markdown = mistune.Markdown(renderer=renderer)
    for f in args.file:
        doc = f.read()
        renderer.my_filename = os.path.abspath(f.name)
        renderer.my_doc = doc
        markdown.render(doc)
