# Contributing to task-manager

First off, thank you for considering contributing to task-manager! We appreciate your interest in making this task manager app better. This project is participating in Hacktoberfest, so we especially welcome new contributors to the open-source community.

#### **Remember: Quality over quantity!**
Meaningful and high-quality contributions are what we're looking for, so don't just focus on the pull request count.

## Code of Conduct
By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and create a welcoming environment for all contributors.

## How to get started

### 1. Set up your development environment
Before you begin, ensure you have the Flutter SDK and a code editor (like VS Code or Android Studio) with the necessary Flutter and Dart plugins installed.

*   **Fork the repository** by clicking the "Fork" button at the top right of this page.
*   **Clone your forked repository** to your local machine.
    ```sh
    git clone https://github.com/YOUR-GITHUB-USERNAME/task-manager.git
    ```
*   **Navigate into the project directory**.
    ```sh
    cd task-manager
    ```
*   **Get the project's dependencies**.
    ```sh
    flutter pub get
    ```
*   **Run the app** on an emulator or device to make sure everything is working.
    ```sh
    flutter run
    ```
*   **Check for any environment issues**.
    ```sh
    flutter doctor
    ```

### 2. Find an issue to work on
To make your contribution count for Hacktoberfest, find an issue that's clearly marked for contributors.
*   Go to the **Issues** tab on the GitHub repository.
*   Look for issues with the `hacktoberfest`, `good first issue`, or `help wanted` labels.
*   Comment on the issue you want to work on to let others know it's being addressed.

### 3. Start coding!
*   **Create a new branch** for your changes. Use a descriptive name like `feat/add-task-due-date` or `fix/task-editing-bug`.
    ```sh
    git checkout -b <your-new-branch-name>
    ```
*   **Make your changes**. Write clean, well-commented code that adheres to the existing style.
*   **Test your changes**. Ensure your code works as expected and doesn't introduce new bugs. If you can, run the existing tests or add new ones.
    ```sh
    flutter test
    ```
*   **Format your code** to maintain a consistent style.
    ```sh
    flutter format .
    ```

### 4. Submit your Pull Request (PR)
*   **Commit your changes** with a clear and concise message that explains your changes. Use a prefix like `feat:`, `fix:`, or `docs:`.
    ```sh
    git commit -m "fix: Resolve bug with editing tasks"
    ```
*   **Push your changes** to your fork on GitHub.
    ```sh
    git push origin <your-new-branch-name>
    ```
*   **Open a Pull Request** to the `main` branch of the original repository. In the PR description, explain the problem your change solves and how you solved it. Link the PR to the issue you were working on (e.g., "Fixes #123").

### What you can contribute
Not all contributions have to be code! We welcome all kinds of help:
*   **Code contributions:** Fix bugs, add new features, improve the existing codebase.
*   **Documentation:** Enhance the `README.md`, comments, or other parts of the documentation.
*   **UI/UX improvements:** Create mockups or new assets to improve the app's design.
*   **Testing:** Write unit or widget tests for better test coverage.
*   **Answering questions:** Help other developers on the issues page or discussions board.

## Thank you for your contribution!
We'll review your PR as soon as possible. Your patience is appreciated, and we look forward to your contribution. Happy Hacktoberfest! 🎉
