-- all categories
SELECT id, name
FROM categories;

-- not empty categories
SELECT categories.*
FROM categories
	JOIN articles_categories ON articles_categories.category_id = categories.id
GROUP BY categories.id;

-- count article by category
SELECT
  categories.*,
  COUNT(articles_categories.article_id)
FROM categories
	JOIN articles_categories ON articles_categories.category_id = categories.id
GROUP BY categories.id;

-- article list
SELECT
	articles.*,
	CONCAT(users.lastname, ' ', users.firstname) AS "author",
	users.email,
	COUNT(DISTINCT comments.id) AS "count comment",
  STRING_AGG(DISTINCT categories.name, ', ') AS "category list"
FROM articles
	JOIN users ON users.id = articles.user_id
	JOIN articles_categories ON articles_categories.article_id = articles.id
	JOIN categories ON categories.id = articles_categories.category_id
	LEFT JOIN comments ON comments.article_id = articles.id
GROUP BY articles.id, users.id
ORDER BY articles.created_at DESC;

-- article by id
SELECT
	articles.*,
	CONCAT(users.lastname, ' ', users.firstname) AS "author",
	users.email,
	COUNT(DISTINCT comments.id) AS "count comment",
  STRING_AGG(DISTINCT categories.name, ', ') AS "category list"
FROM articles
	JOIN users ON users.id = articles.user_id
	JOIN articles_categories ON articles_categories.article_id = articles.id
	JOIN categories ON categories.id = articles_categories.category_id
	LEFT JOIN comments ON comments.article_id = articles.id
WHERE articles.id = 1
GROUP BY articles.id, users.id;

-- last 5 comments
SELECT
	comments.id,
	comments.article_id,
	CONCAT(users.lastname, ' ', users.firstname),
	comments.text
FROM comments
	LEFT JOIN users ON users.id = comments.user_id
ORDER BY comments.created_at
LIMIT 5;

-- comments by article id
SELECT
	comments.id,
	comments.article_id,
	CONCAT(users.lastname, ' ', users.firstname),
	comments.text
FROM comments
	LEFT JOIN users ON users.id = comments.user_id
WHERE comments.article_id = 1
ORDER BY comments.created_at;

-- update title for article with id equal 1
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE articles.id = 1;
