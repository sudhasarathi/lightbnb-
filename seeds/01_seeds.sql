INSERT INTO users (name, email, password)
VALUES('Eva Stanley', 'sebastianguerra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Louisa Meyer', 'jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Dominic Parks', 'victoriablackwell@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, country, street, city, province, post_code, active)
VALUES ('1', 'title1', 'description', 'https://images.pexels.com/photos/2937800/pexels-photo-2937800.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 150, 'Canada', '100 Laurier Avenue', 'Ottawa', 'Ontario', 678656, true),
('2', 'title2', 'description', 'https://images.pexels.com/photos/2937800/pexels-photo-2937800.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 200, 'Canada', '40 Main Street', 'Toronto', 'Ontario', 768754, true),
('3', 'title3', 'description', 'https://images.pexels.com/photos/2937800/pexels-photo-2937800.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 90, 'Canada', '4655 Avenue Gaspé', 'Montreal', 'Quebec', 354645, true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2019-09-01', '2019-09-02', 2, 3),
('2019-09-22', '2019-10-22', 2, 2),
('2019-09-09', '2019-09-12', 1, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 2, 1, 5, 'Best LightBnB ever!'),
(2, 2, 2, 3, 'Nothing to complain about :)'),
(3, 1, 3, 4, 'Great location!');