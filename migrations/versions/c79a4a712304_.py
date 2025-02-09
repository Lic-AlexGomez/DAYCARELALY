"""empty message

Revision ID: c79a4a712304
Revises: 4666c34a2ba4
Create Date: 2025-02-09 15:49:28.708744

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c79a4a712304'
down_revision = '4666c34a2ba4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('password_reset',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('token', sa.String(length=100), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('expires_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('token')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('password_reset')
    # ### end Alembic commands ###
