from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///study.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True
)

def get_session():
    with Session(engine) as session:
        yield session

def create_db():
    SQLModel.metadata.create_all(engine)
