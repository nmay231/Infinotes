# drop table Users;
create table Users (
  id int not null primary key auto_increment,
  username varchar(80) not null,
  role varchar(30) not null default "guest",
  hash varchar(60) not null,
  firstName varchar(60) not null,
  lastName varchar(60) not null,
  numberOfNotes int not null default 0,
  _created datetime not null default current_timestamp
);
#
# drop table Notes;
create table Notes (
  id int not null primary key auto_increment,
  userid int not null,
  content text not null,
  posx int not null,
  posy int not null,
  _created datetime not null default current_timestamp,
  foreign key (userid) references Users(id)
);
#
# drop table Tokens;
create table Tokens (
  id int not null primary key auto_increment,
  userid int not null,
  token text,
  expires datetime,
  _created datetime not null default current_timestamp,
  foreign key (userid) references Users(id)
);