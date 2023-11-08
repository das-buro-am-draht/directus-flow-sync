# directus-flow-sync
This [directus CLI extension](https://docs.directus.io/extensions/hooks.html#custom-api-hooks) allows you to sync your directus flows and operations with your local filesystem.

## Installation
Install npm dependencies:
```bash
npm install
```

## Tests
Run unit tests:
```bash
npm run test
```

## Build
Build the extension:
```bash
npm run build
```

## Deployment
Copy the `dist/index.mjs` file to your directus extensions directory.

## Usage
Export flows and operations to the filesystem:
```bash
npx directus flow export
```

Import flows and operations from the filesystem:
```bash
npx directus flow import
```

## CLI Options
The following CLI options are available when exporting flows and operations:
- `-i`, `--incluce-inactive`: Include inactive flows and operations in the export. Defaults to `false`.

The following CLI options are available when importing flows and operations:
- `-u`, `--user-id <uuid>`: The user id to use for the import. Defaults to `null`.
- `-o`, `--overwrite`: Overwrite existing flows and operations. Defaults to `false`.
- `-i`, `--import-ids <ids>`: A comma separated list of flow ids to import. Defaults to `[]`. If no ids are provided, all flows are imported.


## Configuration
The extension can be configured using the following environment variables:
- `FLOW_SYNC_PATH`: The path to the directory where the flows and operations are stored. Defaults to `./extensions/hooks/flow-sync/config`.


## Contributing
Pull request welcome. For major changes, please open an issue first to discuss what you would like to change.

## Support
In case you need help or have questions, feel free to contact us via [support@dasburo.com](mailto:support@dasburo.com) or [create an issue].

## License
This project is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/) license.

## Credits
Inspired by [Gerard Lamusse's](https://github.com/u12206050) solution in [directus-rbac-sync](https://github.com/u12206050/directus-rbac-sync).
