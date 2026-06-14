from __future__ import annotations

import csv
from datetime import datetime
from pathlib import Path

from sqlalchemy.orm import Session

import database
import models

BASE_DIR = Path(__file__).resolve().parent


def _read_csv_rows(filename: str):
    with (BASE_DIR / filename).open(newline="", encoding="utf-8") as file_handle:
        return list(csv.DictReader(file_handle))

def import_data_from_csv(db: Session):
    if db.query(models.Customer).count() == 0:
        for row in _read_csv_rows("customers.csv"):
            customer = models.Customer(
                customer_id=int(row["customer_id"]),
                name=row["name"],
                email=row["email"],
                phone=row["phone"],
                customer_type=row["customer_type"],
            )
            db.add(customer)
        db.commit()

    if db.query(models.Order).count() == 0:
        for row in _read_csv_rows("orders.csv"):
            order = models.Order(
                order_id=int(row["order_id"]),
                customer_id=int(row["customer_id"]),
                amount=float(row["amount"]),
                order_date=datetime.fromisoformat(row["order_date"]),
            )
            db.add(order)
        db.commit()

    if db.query(models.CustomerSummary).count() == 0:
        for row in _read_csv_rows("customer_summary.csv"):
            summary = models.CustomerSummary(
                customer_id=int(row["customer_id"]),
                total_orders=int(row["total_orders"]),
                total_spent=float(row["total_spent"]),
                last_purchase=datetime.fromisoformat(row["last_purchase"]),
                days_inactive=int(row["days_inactive"]),
            )
            db.add(summary)
        db.commit()

if __name__ == "__main__":
    db = database.SessionLocal()
    import_data_from_csv(db)
    db.close()
