# Corp Comment

A simple web app for submitting, displaying, and upvoting company feedback. Built with JavaScript, HTML, and CSS.

## Features

- Submit feedback with a company hashtag (e.g. `#Acme Great service!`)
- Character counter for feedback input (max 150 chars)
- Visual validation for correct input format
- Feedback list with upvote buttons and badges
- AJAX-powered feedback submission and loading
- Filter feedback by company hashtag
- Prevents malicious code injection (XSS) by using safe DOM methods

## Usage

1. **Clone or download this repository.**
2. **Open `index.html` in your browser.**
3. **Enter feedback in the textarea using a hashtag for the company (e.g. `#Acme Love the new product!`).**
4. **Submit your feedback.**
5. **Upvote feedback or filter by company hashtag using the hashtag list.**

## Project Structure

```
/corp-comment
  ├── index.html
  ├── script.js
  ├── style.css
  └── README.md
```

## Security

- User input is validated and safely rendered to prevent XSS attacks.
- Feedback is sent and received via AJAX to a remote API.

## Customization

- Update the API endpoint in `script.js` if needed.
- Style the app by editing `style.css`.

## License

MIT License

---

*Created for educational purposes.*
