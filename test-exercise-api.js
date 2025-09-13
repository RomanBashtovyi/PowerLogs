// Simple test script to check if exercise API is working
console.log('Testing exercise API...')

// Check if the server is running
fetch('http://localhost:3000/api/test')
  .then((response) => response.json())
  .then((data) => {
    console.log('Server is running:', data)
  })
  .catch((error) => {
    console.error('Server might not be running:', error.message)
    console.log('Please start the development server with: npm run dev')
  })
