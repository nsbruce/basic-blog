class MarkdownParsedComponent extends HTMLElement {
    connectedCallback() {
      const src = this.getAttribute('src');
      if (!src) {
        console.error('Please provide a source (src) attribute for the Markdown file.');
        return;
      }
  
      fetch(src)
        .then(response => response.text())
        .then(text => {
          const [yamlHeader, markdownContent] = this.splitYAMLAndMarkdown(text);
          const yamlData = this.parseYAML(yamlHeader);
          const htmlContent = this.convertMarkdownToHTML(markdownContent);
  
          const combinedContent = `
            <div>
              <pre>${JSON.stringify(yamlData, null, 2)}</pre>
                <div>${htmlContent}</div>
              </div>
              `;
              
          this.innerHTML = combinedContent;
        })
        .catch(error => {
          console.error('Error fetching or processing the file:', error);
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
  
  customElements.define('markdown-parsed', MarkdownParsedComponent);
  