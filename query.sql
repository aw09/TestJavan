DROP TABLE Person;
DROP TABLE Asset;

CREATE TABLE Person (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  gender CHAR(1) NOT NULL,
  parent INTEGER REFERENCES Person(ID)
);


CREATE TABLE Asset (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id INTEGER REFERENCES Person(ID),
  name TEXT NOT NULL
);

-- Person --
INSERT INTO Person (name, gender, parent) Values ('Bani', 'M', NULL);
INSERT INTO Person (name, gender, parent) Values ('Budi', 'M', 1), ('Nida', 'F', 1), ('Andi', 'M', 1), ('Sigit', 'M', 1); 
INSERT INTO Person (name, gender, parent) Values ('Hari', 'M', 2), ('Siti', 'F', 2);
INSERT INTO Person (name, gender, parent) Values ('Bila', 'F', 3), ('Lesti', 'F', 3);
INSERT INTO Person (name, gender, parent) Values ('Didi', 'M', 4);
INSERT INTO Person (name, gender, parent) Values ('Doni', 'M', 5), ('Toni', 'M', 5);

-- Asset --
INSERT INTO Asset (person_id, name) Values (2, 'Samsung Universe 9'), (2, 'Samsung Galaxy Book');
INSERT INTO Asset (person_id, name) Values (3, 'Huawei P30');
INSERT INTO Asset (person_id, name) Values (4, 'Samsung Universe 9');
INSERT INTO Asset (person_id, name) Values (5, 'Huawei P30');
INSERT INTO Asset (person_id, name) Values (6, 'iPhone 9');
INSERT INTO Asset (person_id, name) Values (7, 'iPhone X');
INSERT INTO Asset (person_id, name) Values (8, 'Samsung Universe 9');
INSERT INTO Asset (person_id, name) Values (9, 'Huawei P30'), (9, 'iPhone X');
INSERT INTO Asset (person_id, name) Values (10, 'Samsung Galaxy Book');
INSERT INTO Asset (person_id, name) Values (11, 'iPhone X');