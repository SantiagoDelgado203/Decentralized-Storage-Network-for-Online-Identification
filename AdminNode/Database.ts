import { Pool } from 'pg';
import { User, Provider, DB_Request } from './Models'

export async function checkDatabase(pool: Pool) {
   
    try {
        const res = await pool.query('SELECT 1');
        console.log("Database connectivity successful!");
    } catch (err) {
        console.error('Database query error: ', err);
    }
}


export async function upsertUser(pool: Pool, user: User) {
  if (user.userid) {
    const { rows } = await pool.query(
      `
      UPDATE users
      SET email = $1,
          hashedpassword = $2,
          salt = $3
      WHERE userid = $4
      RETURNING *
      `,
      [user.email, user.hashedpassword, user.salt, user.userid]
    );
    return rows[0];
  }

  const { rows } = await pool.query(
    `
    INSERT INTO users (email, hashedpassword, salt)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [user.email, user.hashedpassword, user.salt]
  );
  return rows[0];
}

export async function getUserById(pool: Pool, userid: string) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM users
    WHERE userid = $1
    `,
    [userid]
  );

  return rows[0] ?? null;
}


export async function deleteUser(pool: Pool, userid: string) {
  await pool.query(
    `DELETE FROM users WHERE userid = $1`,
    [userid]
  );
}

export async function upsertProvider(pool: Pool, provider: Provider) {
  if (provider.providerid) {
    const { rows } = await pool.query(
      `
      UPDATE providers
      SET registeredname = $1,
          hashedpassword = $2,
          salt = $3
      WHERE providerid = $4
      RETURNING *
      `,
      [
        provider.registeredname,
        provider.hashedpassword,
        provider.salt,
        provider.providerid
      ]
    );
    return rows[0];
  }

  const { rows } = await pool.query(
    `
    INSERT INTO providers (registeredname, hashedpassword, salt)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [provider.registeredname, provider.hashedpassword, provider.salt]
  );
  return rows[0];
}

export async function getProviderById(pool: Pool, providerid: string) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM providers
    WHERE providerid = $1
    `,
    [providerid]
  );

  return rows[0] ?? null;
}


export async function deleteProvider(pool: Pool, providerid: string) {
  await pool.query(
    `DELETE FROM providers WHERE providerid = $1`,
    [providerid]
  );
}

export async function createRequest(pool: Pool, request: DB_Request) {
  const { rows } = await pool.query(
    `
    INSERT INTO requests (
      providerid,
      userid,
      companyname,
      datarequests,
      status
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      request.providerid ?? null,
      request.userid ?? null,
      request.companyname,
      request.datarequests,
      request.status
    ]
  );
  return rows[0];
}

export async function updateRequest(pool: Pool, request: DB_Request) {
  if (!request.requestid) {
    throw new Error('requestid is required for update');
  }

  const { rows } = await pool.query(
    `
    UPDATE requests
    SET providerid = $1,
        userid = $2,
        companyname = $3,
        datarequests = $4,
        status = $5
    WHERE requestid = $6
    RETURNING *
    `,
    [
      request.providerid ?? null,
      request.userid ?? null,
      request.companyname,
      request.datarequests,
      request.status,
      request.requestid
    ]
  );
  return rows[0];
}

type RequestQuery = {
  requestid?: string;
  userid?: string;
  providerid?: string;
};

export async function getRequests(
  pool: Pool,
  query: RequestQuery
) {
  const conditions: string[] = [];
  const values: any[] = [];

  if (query.requestid) {
    values.push(query.requestid);
    conditions.push(`requestid = $${values.length}`);
  }

  if (query.userid) {
    values.push(query.userid);
    conditions.push(`userid = $${values.length}`);
  }

  if (query.providerid) {
    values.push(query.providerid);
    conditions.push(`providerid = $${values.length}`);
  }

  if (conditions.length === 0) {
    throw new Error('At least one identifier must be provided');
  }

  const sql = `
    SELECT *
    FROM requests
    WHERE ${conditions.join(' AND ')}
  `;

  const { rows } = await pool.query(sql, values);
  return rows;
}



