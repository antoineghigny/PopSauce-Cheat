# Pop Sauce Answer Revealer

## Introduction
Pop Sauce Answer Revealer is a custom user script for the online game 'Pop Sauce' hosted at [jklm.fun](https://jklm.fun/). This script is intended for educational purposes, to demonstrate interaction with web elements and local databases. It automates the process of revealing game answers through a combination of user interactions and backend operations. 

**Note:** This script is not designed for actual gameplay enhancement and its use may violate the game's terms of service. The creator is not responsible for any consequences arising from the script's misuse.

## Repository Structure
```
├─── 📄 readme.md
├─── 📄 .gitignore
|
├─── 📁 pop_sauce_revealer
│   │   📄 popsauce.db
│   │   📄 run.py
│   │
│   └─── 📁 app
│       │   📄 api.py
│       │   📄 config.py
│       │   📄 database.py
│       │   📄 services.py
│       │   📄 __init__.py
│       │
│
└─── 📁 tampermonkey
        📄 pop_sauce_revealer.js
```

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Add the UserScript](#add-the-userscript)
  - [Setting up the Server and Database](#setting-up-the-server-and-database)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Disclaimer](#disclaimer)
- [Contributors](#contributors)
- [License](#license)

## Installation
### Prerequisites
- Ensure you have Python installed. This project is compatible with Python 3.6 or later.
- Install Tampermonkey for your browser from the [official website](https://www.tampermonkey.net/).

2. **Add the UserScript:**
   - Copy the JavaScript code provided for Pop Sauce Answer Revealer.
   - Open Tampermonkey in your browser, add a new script, paste the code, and save.

3. **Setting up the Server and Database:**
   - Ensure Python is installed on your system.
   - Navigate to the "pop_sauce_revealer" directory:
     ```bash
     cd pop_sauce_revealer
     ```
   - Start the server by running the `run.py` file:
     ```bash
     python run.py
     ```
   - This will launch the Flask application, and the server will be ready for use.

## Usage
- The Pop Sauce Answer Revealer script will automatically activate when you navigate to 'Pop Sauce' on [jklm.fun](https://jklm.fun/) due to the `@match` directive in the script.
- To reveal an answer, type `+` in the game's input field. The script interacts with the local server to fetch or record answers.

## How It Works
1. **Monitoring and Interaction**: The script continually monitors game elements for changes, like new challenges or revealed answers.
2. **Hashing and Data Retrieval**: When you press `+`, it hashes the content of the current question and searches the local database for an existing answer.
3. **Database Interaction**: If the answer exists, it is displayed. If not, the answer (once revealed in the game) is recorded in the database for future use.

## Dependencies

1. **Flask**: Flask is a micro web framework for Python. You can install it via pip:
    ```bash
    pip install flask
    ```

2. **Flask-CORS**: Flask-CORS is a Flask extension for handling Cross Origin Resource Sharing (CORS). Install it using pip:
    ```bash
    pip install flask_cors
    ```

3. **Tampermonkey Browser Extension**: [Tampermonkey](https://www.tampermonkey.net/). is a browser extension that enables you to add and manage user scripts. You can install it from the extension store of your preferred web browser.

Make sure to install these dependencies before running the application. Once installed, you can start the Flask application as described in the "Setting up the Server and Database" section. 


## Configuration
- **API Base URL**: Set the `API_BASE_URL` in the script to match your server's URL.
- **Database**: Uses SQLite, included in Python's standard library.
- **Adjusting the Monitoring Interval**: You can adjust the frequency of the script's monitoring process by changing the `MONITOR_INTERVAL` value in the Tampermonkey script. The default is set to 3000 milliseconds (3 seconds). Increasing this value will reduce the frequency of checks, while decreasing it will make them more frequent.

## Disclaimer
This script is for educational purposes only. The author disclaims responsibility for any misuse of the script or any violation of game terms and conditions. Users should be aware of potential risks, including account penalties, when using scripts that alter gameplay.

## Contributors
- [Antoine](#) - [GitHub](https://github.com/antoineghigny)


## License
This project is shared without a specific license and is intended for personal and educational use only.
