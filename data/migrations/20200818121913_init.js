exports.up = function (knex) {
  return knex.schema.createTable("users", (tbl) => {
    tbl.increments();

    tbl.string("username", 155).notNullable().unique().index();
    tbl.string("password", 255).notNullable();
    tbl.string("department", 255).notNullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
