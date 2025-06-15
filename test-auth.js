const BASE_URL = 'http://localhost:3000';

async function testAuth() {
  try {
    console.log('Testing Authentication and Favorites...');
    
    // Test user registration
    const registerResponse = await fetch(`${BASE_URL}/authentication/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ User Registration:', registerResponse.ok ? 'SUCCESS' : 'FAILED');
    if (!registerResponse.ok) {
      console.log('Registration Error:', registerData);
      return;
    }
    
    // Test user login
    const loginResponse = await fetch(`${BASE_URL}/authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ User Login:', loginResponse.ok ? 'SUCCESS' : 'FAILED');
    if (!loginResponse.ok) {
      console.log('Login Error:', loginData);
      return;
    }
    
    const token = loginData.data.accessToken;
    console.log('🔑 Access Token:', token ? 'RECEIVED' : 'MISSING');
    
    // Test creating an author first
    const authorResponse = await fetch(`${BASE_URL}/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'J.K. Rowling',
        bio: 'British author best known for Harry Potter',
        birthYear: 1965,
      }),
    });
    
    const authorData = await authorResponse.json();
    console.log('✅ Author Creation:', authorResponse.ok ? 'SUCCESS' : 'FAILED');
    if (!authorResponse.ok) {
      console.log('Author Error:', authorData);
      return;
    }
    
    // Test creating a book
    const bookResponse = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Harry Potter and the Philosopher\'s Stone',
        summary: 'A young wizard\'s journey begins',
        publicationYear: 1997,
        authorId: authorData.data.id,
      }),
    });
    
    const bookData = await bookResponse.json();
    console.log('✅ Book Creation:', bookResponse.ok ? 'SUCCESS' : 'FAILED');
    if (!bookResponse.ok) {
      console.log('Book Error:', bookData);
      return;
    }
    
    // Test adding to favorites
    const favoriteResponse = await fetch(`${BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookId: bookData.data.id,
      }),
    });
    
    const favoriteData = await favoriteResponse.json();
    console.log('✅ Add to Favorites:', favoriteResponse.ok ? 'SUCCESS' : 'FAILED');
    if (!favoriteResponse.ok) {
      console.log('Favorite Error:', favoriteData);
      return;
    }
    
    // Test getting favorites
    const getFavoritesResponse = await fetch(`${BASE_URL}/favorites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const getFavoritesData = await getFavoritesResponse.json();
    console.log('✅ Get Favorites:', getFavoritesResponse.ok ? 'SUCCESS' : 'FAILED');
    if (getFavoritesResponse.ok) {
      console.log(`📚 Favorites Count: ${getFavoritesData.data.length}`);
    }
    
    console.log('\n🎉 All authentication and favorites tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth(); 