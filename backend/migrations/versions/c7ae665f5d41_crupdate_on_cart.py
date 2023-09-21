"""CrUpdate on cart

Revision ID: c7ae665f5d41
Revises: 2a8e981bfbdf
Create Date: 2023-09-21 14:32:13.152814

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c7ae665f5d41'
down_revision = '2a8e981bfbdf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart', schema=None) as batch_op:
        batch_op.drop_column('image')

    # ### end Alembic commands ###