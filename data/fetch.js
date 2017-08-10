export default function dbCall(sql, knex, context) {

    if(context.groupBy.length > 0) {

        // looks odd, but currently there is no other obvious way to hande multiple groupBy in one graphQL query
        // context.groupBy is stacked during tree parsing, so first item in contecxt.groupBy contains
        // fields for the first groupBy statement
        // TODO: implement a proper way of grouping here

        sql += ` group by ${context.groupBy.shift().join(',')}`;

    }

  // this is a little trick to help debugging and demo-ing. the client will display whatever is on the X-SQL-Preview header
  // DONT do something like this in production
  if (context) {
    context.set('X-SQL-Preview', context.response.get('X-SQL-Preview') + '%0A%0A' + sql.replace(/%/g, '%25').replace(/\n/g, '%0A'))
  }
  // send the request to the database
  return knex.raw(sql)
}

