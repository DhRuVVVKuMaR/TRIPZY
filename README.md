# TRIPZY

A modern, animated website of TRIPZY built with React, styled-components, and Firebase.

## Features

- Modern and responsive design
- Smooth animations using Framer Motion
- Firebase integration for waitlist form
- Clean and maintainable code structure
- Custom styling with styled-components
- Mobile-friendly interface

## Tech Stack

- React.js
- Styled Components
- Framer Motion
- Firebase
- React Router
- HTML5/CSS3

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd tripzy-clone
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a Firebase project and update the configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Get your Firebase configuration
   - Update the config in `src/firebase/config.js`

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── styles/        # Global styles
  ├── firebase/      # Firebase configuration
  ├── App.js         # Main App component
  └── index.js       # Entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original TRIPZY website for inspiration
- Framer Motion for animations
- Styled Components for styling
- Firebase for backend services 
