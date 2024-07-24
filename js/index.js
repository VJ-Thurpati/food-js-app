document.addEventListener('DOMContentLoaded', async () => {
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/restaurants');
            const data = await response.json();

            // Display restaurant data
            const restaurantCards = document.getElementById('restaurant-cards');
            restaurantCards.innerHTML = data.map(restaurant => `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${restaurant.imageurl}" class="card-img-top" alt="${restaurant.name}">
                        <div class="card-body">
                            <h5 class="card-title">${restaurant.name}</h5>
                            <p class="card-text">${restaurant.address}</p>
                            <p class="card-text">Rating: ${restaurant.rating}</p>
                            <p class="card-text">Reviews: ${restaurant.reviews}</p>
                            <button class="btn btn-primary view-more" data-id="${restaurant.id}">View More</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add event listeners to the "View More" buttons
            document.querySelectorAll('.view-more').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const restaurantId = event.target.dataset.id;
                    console.log('View More button clicked for restaurant ID:', restaurantId);
                    const restaurant = data.find(rest => rest.id == restaurantId);
                    console.log('Selected restaurant data:', restaurant);
                    
                    // Fetch dishes data for the selected restaurant
                    const dishes = restaurant.menu; // Assuming menu is included in the restaurant data

                    const heroContent = document.getElementById('hero-content');
                    heroContent.innerHTML = `
                        <div class="card">
                            <img src="${restaurant.imageurl}" class="card-img-top" alt="${restaurant.name}">
                            <div class="card-body">
                                <h5 class="card-title">${restaurant.name}</h5>
                                <p class="card-text">${restaurant.address}</p>
                                <p class="card-text">Rating: ${restaurant.rating}</p>
                                <p class="card-text">Reviews: ${restaurant.reviews}</p>
                                <p class="card-text"><strong>Address:</strong> ${restaurant.address}</p>
                                <p class="card-text"><strong>Phone:</strong> ${restaurant.phone}</p>
                                <h5>Dishes:</h5>
                                <div class="row">
                                    ${dishes.map(dish => `
                                        <div class="col-md-4">
                                            <div class="card mb-4">
                                                <img src="${dish.imageurl}" class="card-img-top" alt="${dish.name}">
                                                <div class="card-body">
                                                    <h5 class="card-title">${dish.name}</h5>
                                                    <p class="card-text">Price: $${dish.price}</p>
                                                    <p class="card-text">Rating: ${dish.rating}</p>
                                                    <p class="card-text">Reviews: ${dish.reviews}</p>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="btn btn-primary back">Back</button>
                            </div>
                        </div>
                    `;
                    
                    document.querySelector('.back').addEventListener('click', () => {
                        // Reload the data when "Back" button is clicked
                        resetHome();
                    });
                });
            });

            // Add event listener to the "Sign Up" button
            document.getElementById('signup-btn').addEventListener('click', () => {
                const heroContent = document.getElementById('hero-content');
                heroContent.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Sign Up</h5>
                            <form id="signup-form">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input type="text" id="name" name="name" class="form-control" required>
                                    <small class="error" id="name-error"></small>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" class="form-control" required>
                                    <small class="error" id="email-error"></small>
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" id="password" name="password" class="form-control" required>
                                    <small class="error" id="password-error"></small>
                                </div>
                                <div class="form-group">
                                    <label for="confirm-password">Confirm Password</label>
                                    <input type="password" id="confirm-password" name="confirm-password" class="form-control" required>
                                    <small class="error" id="confirm-password-error"></small>
                                </div>
                                <button type="submit" class="btn btn-primary">Sign Up</button>
                            </form>
                        </div>
                    </div>
                `;

                // Add event listener to the sign-up form
                document.getElementById('signup-form').addEventListener('submit', async (event) => {
                    event.preventDefault();

                    // Clear previous errors
                    document.getElementById('name-error').innerText = '';
                    document.getElementById('email-error').innerText = '';
                    document.getElementById('password-error').innerText = '';
                    document.getElementById('confirm-password-error').innerText = '';

                    // Get form values
                    const name = document.getElementById('name').value;
                    console.log(name)
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    const confirmPassword = document.getElementById('confirm-password').value;

                    // Perform validation
                    let hasError = false;
                    if (name.trim() === '') {
                        document.getElementById('name-error').innerText = 'Name is required.';
                        hasError = true;
                    }
                    if (email.trim() === '') {
                        document.getElementById('email-error').innerText = 'Email is required.';
                        hasError = true;
                    }
                    if (password.trim() === '') {
                        document.getElementById('password-error').innerText = 'Password is required.';
                        hasError = true;
                    }
                    if (confirmPassword.trim() === '') {
                        document.getElementById('confirm-password-error').innerText = 'Confirm Password is required.';
                        hasError = true;
                    }
                    if (password !== confirmPassword) {
                        document.getElementById('confirm-password-error').innerText = 'Passwords do not match.';
                        hasError = true;
                    }

                    // If no errors, submit the form
                    if (!hasError) {
                        const formData = {
                            name,
                            email,
                            password
                        };

                        // Send data to the server
                        try {
                            const response = await fetch('http://localhost:3000/customers', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(formData)
                            });
    
                            const result = await response.json();

                            if (response.ok) {
                                alert('Sign up successful!');
                                // Optionally, redirect to a different page or show a success message
                            } else {
                                alert(`Sign up failed: ${result.message}`);
                            }
                        } catch (error) {
                            console.error('Error during sign-up:', error);
                            alert('Sign up failed. Please try again later.');
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const resetHome = async () => {
        // Clear the hero content and fetch the data again
        document.getElementById('hero-content').innerHTML = '';
        await fetchData();
    };
 
    // Initial data fetch
    await fetchData();

    // Add event listener to the logo
    document.getElementById('home-logo').addEventListener('click', resetHome);
});
