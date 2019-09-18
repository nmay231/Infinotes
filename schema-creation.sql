create table Users (
  id int not null primary key auto_increment,
  username varchar(80) not null,
  hash varchar(60) not null,
  first_name varchar(60) not null,
  last_name varchar(60) not null,
  number_of_notes int not null default 0
) create table Notes (
  id int not null primary key auto_increment,
  userid int not null,
  content text not null,
  posx int not null,
  posy int not null,
  foreign key (userid) references Users(id)
)