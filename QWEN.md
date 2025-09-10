# GEMINI Project Context: Ghost Squad

## Project Overview

This project, internally named "Quem Quer ser um Ecto-Nauta?" (QWEN), is a multiplayer location-based augmented reality (AR) game. Players take on the role of Ghost Squad, tasked with capturing ghosts that appear at real-world locations.

The application is built as a web app using vanilla JavaScript (ES6 Modules), A-Frame for the AR scene, and Leaflet.js for the 2D map. Firebase is used for the backend, handling user authentication (Google, Email, Anonymous) and real-time database for player data (points, captures, inventory).

### Core Technologies:

*   **Frontend:** JavaScript (ES6 Modules), HTML5, CSS3
*   **AR:** A-Frame (`<a-scene>`) with WebXR
*   **Mapping:** Leaflet.js
*   **Backend:** Firebase (Authentication, Realtime Database)
*   **Testing:** Jest, Babel
*   **QR Code Scanning:** `html5-qrcode` library

### Architecture:

The application follows a modular, class-based architecture. A central `game-manager` component (in `main.js`) initializes and orchestrates several manager modules, each with a specific responsibility:

*   `AuthManager`: Handles all Firebase authentication logic.
*   `GameStateManager`: Manages the core game state, including player stats, inventory, locations, and ghost data.
*   `ARManager`: Manages the A-Frame AR scene, including hit-testing for plane detection and placing/managing 3D models.
*   `UIManager`: Controls all UI elements, screen transitions, and user interactions.
*   `MapManager`: Manages the Leaflet.js minimap, player/ghost markers, and proximity calculations.
*   `QRManager`: Handles the logic for scanning QR codes on "Containment Units".
*   `RankingsManager`: Manages fetching and displaying player rankings.

## Building and Running

This is a client-side web project with no server-side build step required.

### Running the Project:

1.  **Serve the directory:** You need a local web server to run the project due to browser security policies (CORS) for ES6 modules and WebXR.
    *   If you have Python 3: `python -m http.server`
    *   If you have Node.js: `npx serve`
2.  **Access the URL:** Open the provided URL (e.g., `http://localhost:8000`) on a WebXR-compatible browser on a smartphone (like Google Chrome for Android).

### Testing:

The project uses Jest for unit testing.

*   **Run all tests:**
    ```bash
    npm test
    ```
*   **Run tests in watch mode:**
    ```bash
    npm run test:watch
    ```

## Development Conventions

*   **Modularity:** Code is organized into distinct ES6 modules/classes, each handling a specific domain (UI, AR, State, etc.). This is the primary architectural pattern.
*   **A-Frame Integration:** The core logic is managed within an A-Frame component (`game-manager`) attached to the `<a-scene>` element.
*   **State Management:** The `GameStateManager` class acts as a single source of truth for the game's state. Other modules query it for information but do not hold their own state logic.
*   **Event-Driven:** UI interactions and game events are handled through event listeners that call methods on the appropriate manager modules.
*   **Testing:** Tests are located in the `/tests` directory and mirror the structure of the main source files. Mocks are used for external dependencies like `html5-qrcode`. The configuration in `package.json` shows that coverage is collected from all `.js` files except for a few visual/entry-point files.
