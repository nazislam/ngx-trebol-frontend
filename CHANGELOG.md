# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Add the unitValue property to ReceiptDetail model class making the model compatible with the new API.
- This change updates the entity model for Person and the corresponding data forms.
- Added a table component to display details in the receipt page.
- Included Edge browser launcher for Karma tests
- Add properties `token`, `taxValue`, `transportValue`, `totalValue`, `totalItems` to Receipt model class (Compliance with API v1.1)
- Include new information in receipt page

### Fixed
- Footer remains stuck at the bottom of the page, instead of the viewport.
- Karma tests not starting after connected from a browser (+ now displays spec results in console)

## [v1.0.1] - 2021-10-21

### Fixed
- Login status not refreshing when using local memory (mock) api module
  - Fix related unit tests

## [1.0.0] - 2021-09-23

First public version.
