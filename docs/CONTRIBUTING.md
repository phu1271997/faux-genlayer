# Contributing to Faux

Thank you for contributing to Faux!

## Development Guidelines
1. All contracts must reside in `contracts/` and inheritance must be `Contract(gl.Contract)`.
2. Do not alias `from genlayer import *`.
3. All storage structs must be decorated with `@allow_storage @dataclass`.
4. Run `pytest tests/` before opening a Pull Request.
5. All PRs must include CHANGELOG.md release notes.
