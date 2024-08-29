# Insightive README

Welcome to the **Insightive** project! This README will guide you through writing and adding articles, as well as contributing via pull requests (PRs). Our site is built with **Hugo** and features the sleek **PaperMod** theme.

## Getting Started

### Prerequisites

1. **Install Hugo**: Follow the [Hugo installation guide](https://gohugo.io/getting-started/installing/) to set up Hugo on your machine.
2. **Clone the Repository**: Clone this repository to your local machine:
   ```bash
   git clone https://github.com/dheerajroy/insightive.git
   ```

### Writing an Article

1. **Navigate to the Content Directory**: 
   ```bash
   cd insightive/content
   ```

2. **Create a New Article**:
   Generate a new Markdown file in the `content/posts` directory. Use a descriptive filename with the `.md` extension. For example:
   ```bash
   hugo new posts/my-new-article.md
   ```

3. **Edit the Article**:
   Open the newly created Markdown file in your preferred editor. Update the front matter and article content. Example front matter:
   ```markdown
   ---
   title: "Your Article Title"
   date: 2024-08-30T10:00:00Z
   draft: true
   tags: ["technology", "self-development"]
   ---
   ```

   Customize the `title`, `date`, and other fields as needed. Write your article content below the front matter.

4. **Preview Your Changes**:
   Start the Hugo server to preview your article locally:
   ```bash
   hugo server -D
   ```
   Visit `http://localhost:1313` in your browser to see your changes.

### Contributing Articles

If you’d like to contribute by writing articles, follow these steps:

1. **Fork the Repository**: Click the "Fork" button on the [Insightive GitHub page](https://github.com/dheerajroy/insightive) to create your own copy of the repository.

2. **Create a New Article**:
   Add your article in the `content/posts` directory of your forked repository. Use a meaningful filename and the `.md` extension.

3. **Commit and Push Your Changes**:
   Commit your changes to your forked repository:
   ```bash
   git add .
   git commit -m "Add a new article: Your Article Title"
   git push origin main
   ```

4. **Submit a Pull Request**:
   Go to your forked repository on GitHub and create a new pull request (PR) to merge your changes into the main repository. Provide a clear description of your article and any relevant details.

### Using the PaperMod Theme

**Insightive** uses the **PaperMod** theme for a modern and clean look. For customization options and usage details, visit the [PaperMod documentation](https://adityatelange.github.io/hugo-PaperMod/).
