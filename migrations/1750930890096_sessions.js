/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('sessions', {
    id: { type: 'varchar(26)', notNull: true, primaryKey: true },
    token: { type: 'varchar(24)', notNull: true, unique: true },
    user_id: {
      type: 'varchar(26)',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'cascade',
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    expires_at: { type: 'timestamptz', notNull: true }
  });

  pgm.createIndex('sessions', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('sessions', { ifExists: true });
};
