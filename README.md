# Schofinity
Schofinity is a platform that provides scholarship information and assists users in preparing for scholarship applications through programs like bootcamps, workshops, and mentoring. 

> [!NOTE]
> This project is a complete rebuild of the [original Schofinity](https://github.com/yogarn/schofinity), developed to learn and implement several modern technologies.

## Get Started
### Prerequisites
Make sure you have Bun installed. If not, you can install it globally with:

```bash
npm i -g bun
```

### Install dependencies
Use Bun to install all dependencies:

```bash
bun install
```

### Configure environment
You need to configure your environment variables:
1. Create a `.env` file in the project’s root directory.
2. Inside `.env`, set the `ENVIRONMENT` variable to match the JSON config file you want to use.
For example, if you have a config file at `config/development.json`, use:

```env
ENVIRONMENT=development
```

> [!NOTE]
> The `.env` file is only used to specify the JSON config name.

### Run migrations
Before starting the app, make sure your database schema is up-to-date:

```bash
bun run migrate up -f config/{configuration}.json
```

> [!NOTE]
> Replace `{configuration}` with your desired config file name.

### Start the application
Finally, run the app:

```bash
bun run index.ts
```
