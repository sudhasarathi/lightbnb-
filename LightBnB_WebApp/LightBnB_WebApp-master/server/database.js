const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {Pool} =  require('pg');

/// Users
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});
pool.connect ();

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  pool.query(`
    SELECT * FROM users WHERE email = $1
  `,[email]).then(resp => {
    console.log(resp.rows)
  });


  return pool.query(`
    SELECT * 
    FROM users 
    WHERE email = $1
  `,[email]).then(resp => resp.rows[0]);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * 
  FROM users
  WHERE id = $1`,[id]).then(resp => resp.rows[0]);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query( `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `,[user.name, user.email, user.password]).then(resp => resp.rows[0]);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryParams = [];

  let queryString = `
  SELECT reservations.*, properties.*, AVG(property_reviews.rating) as average_rating
  FROM property_reviews
  JOIN reservations ON property_reviews.property_id = reservations.property_id
  JOIN properties ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1 and end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY start_date ASC
  LIMIT $2
  `;
  return Promise.resolve(pool.query(queryString, [guest_id, limit]).then((result) => {
    return result.rows;
  }).catch((err) => {
    console.log(err.message);
  }));
};
exports.getAllReservations = getAllReservations;


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  // set up start of query
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id 
  `;

  // if city is passed through options append the appropriate query to queryString
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }

  // All other potential WHERE query options check to see if queryParams conatins anything
  // if it does, use AND before query option
  // if it doesn't, use WHERE since it means it's the first option

  // if minimum_price_per_night is passed through options append the appropriate query to queryString
  if (options.minimum_price_per_night && queryParams.length > 0) {
    queryParams.push(`${(options.minimum_price_per_night * 100)}`);
    queryString += `AND cost_per_night >= $${queryParams.length}`;
  }
  if (options.minimum_price_per_night && queryParams.length === 0) {
    queryParams.push(`${(options.minimum_price_per_night * 100)}`);
    queryString += `WHERE cost_per_night >= $${queryParams.length}`;
  }

  // if maximum_price_per_night is passed through options append the appropriate query to queryString
  if (options.maximum_price_per_night && queryParams.length > 0) {
    queryParams.push(`${(options.maximum_price_per_night * 100)}`);
    queryString += `AND cost_per_night <= $${queryParams.length}`;
  }
  if (options.maximum_price_per_night && queryParams.length === 0) {
    queryParams.push(`${(options.maximum_price_per_night * 100)}`);
    queryString += `WHERE cost_per_night <= $${queryParams.length}`;
  }

  // if owner_id is passed through options append the appropriate query to queryString
  if (options.owner_id && queryParams.length > 0) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length}`;
  }
  if (options.owner_id && queryParams.length === 0) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE owner_id = $${queryParams.length}`;
  }

  // append the GROUP BY portion to the queryString
  queryString += `
  GROUP BY properties.id
  `;

  // if there is a minimum_rating in options append the HAVING query to the queryString
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING average_rating >= $${queryParams.length}`;
  }

  // ORDER BY cost per night and append the LIMIT to the queryString
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return Promise.resolve(pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    }));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
