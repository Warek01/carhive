CREATE EXTENSION IF NOT EXISTS VECTOR;

-- CREATE TABLE IF NOT EXISTS listing_embeddings
-- (
--     id        INT PRIMARY KEY,
--     embedding VECTOR NOT NULL,
--
--     FOREIGN KEY (id) REFERENCES listings (id)
-- );

ALTER TABLE IF EXISTS listings
    ADD COLUMN embedding VECTOR;
