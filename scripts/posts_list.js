class PostsListComponent extends HTMLElement {
    connectedCallback() {
      const srcDir = this.getAttribute('srcDir');
      if (!srcDir) {
        console.error('Please provide a source directory (srcDir) attribute for the Markdown files.');
        return;
      }
  
      fetch(src)
        .then(response => response.text())
        .then(data => {
          const fileURLs = data.split('\n').filter(url => url.trim().endsWith('.md'));
          fileUrls.forEach(url => {
            fetch(url)
              .then(response => response.text())
              .then(text => {
                const [yamlHeader, markdownContent] = this.splitYAMLAndMarkdown(text);
                const yamlData = this.parseYAML(yamlHeader);
                const htmlContent = this.convertMarkdownToHTML(markdownContent);

                this.innerHTML += `
                  <div>
                  <pre>${JSON.stringify(yamlData, null, 2)}</pre>
                  <h1>${yamlData.title}</h1>
                  <div>${htmlContent}</div>
                  </div>
                  `;
              })
              .catch(error => {
                console.error('Error fetching or processing the file:', error);
              })
          })
        })
        .catch(error => {
          console.error('Error fetching or processing the directory:', error);
        });
    }
  
    splitYAMLAndMarkdown(text) {
      const matches = text.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
      if (matches && matches.length === 3) {
        return [matches[1], matches[2]];
      }
      return ['', text];
    }
  
    parseYAML(yamlString) {
      try {
        return jsyaml.load(yamlString) || {};
      } catch (error) {
        console.error('Error parsing YAML:', error);
        return {};
      }
    }
  
    convertMarkdownToHTML(markdownContent) {
      return marked.parse(markdownContent);
    }
  }
  
  customElements.define('list-of-posts', PostsListComponent);
  
