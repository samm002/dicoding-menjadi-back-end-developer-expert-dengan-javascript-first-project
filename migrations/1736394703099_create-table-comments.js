/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(100)',
      notNull: true,
      references: '"threads"',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(100)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    parent_comment_id: {
      type: 'VARCHAR(100)',
      notNull: false,
      references: '"comments"',
      onDelete: 'cascade',
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: false,
      default: false,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  `);
};

exports.down = pgm => {
  pgm.dropTable('comments');
};
