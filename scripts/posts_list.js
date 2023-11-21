class PostsListComponent extends HTMLElement {
    connectedCallback() {
      const manifest = this.getAttribute('manifest');
      if (!manifest) {
        console.error('Please provide a manifest file attribute (manifest) for the Markdown files.');
        return;
      }

      const manifestDir = manifest.split('/')[0]
      console.log('the manifest dir', manifestDir)
      console.log('the manifest', manifest)

      fetch(manifest)
        .then(response => response.text())
        .then(data => {
          console.log('data from manifest response', data)
          const fileURLs = data.split('\n').filter(url => url.trim().endsWith('.md'));
          console.log('list of file urls', fileURLs)
          fileUrls.forEach(url => {
            fetch(`{$manifestDir}/{$url}`)
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
  
