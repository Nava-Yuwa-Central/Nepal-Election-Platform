import psycopg2
import psycopg2.extras
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database(db_params):
    # Connect to PostgreSQL server
    conn = psycopg2.connect(
        dbname='postgres',  # Connect to default 'postgres' database initially
        user=db_params['user'],
        password=db_params['password'],
        host=db_params['host'],
        port=db_params['port']
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()

    # Create database if it doesn't exist
    cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_params['dbname'],))
    exists = cursor.fetchone()
    if not exists:
        cursor.execute(f"CREATE DATABASE {db_params['dbname']}")
        print(f"Database '{db_params['dbname']}' created successfully.")
    else:
        print(f"Database '{db_params['dbname']}' already exists.")

    cursor.close()
    conn.close()

# The create_tables and insert_test_data functions are removed
# as Drizzle Kit manages table creation and migrations,
# and seed-db.mjs handles data seeding for this project.

if __name__ == "__main__":
    # Parameters for connecting to your PostgreSQL Docker container
    db_params = {
        'dbname': 'nepal_election',  # Changed to the correct database name
        'user': 'db_user',
        'password': 'db_pwd@123',
        'host': 'localhost',
        'port': '5433'
    }
    create_database(db_params)
    # create_tables(db_params) # Removed
    # insert_test_data(db_params) # Removed