PENDING = "PENDING"
UNDER_REVIEW = "UNDER_REVIEW"
APPROVED = "APPROVED"
WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT"
PAID = "PAID"
CONFIRMED = "CONFIRMED"
READY_FOR_TRAVEL = "READY_FOR_TRAVEL"
IN_PROGRESS = "IN_PROGRESS"
COMPLETED = "COMPLETED"
REJECTED = "REJECTED"
CANCELLED = "CANCELLED"
PAYMENT_EXPIRED = "PAYMENT_EXPIRED"


RESERVATION_STATUSES = (
    PENDING,
    UNDER_REVIEW,
    APPROVED,
    WAITING_FOR_PAYMENT,
    PAID,
    CONFIRMED,
    READY_FOR_TRAVEL,
    IN_PROGRESS,
    COMPLETED,
    REJECTED,
    CANCELLED,
    PAYMENT_EXPIRED,
)

VALID_TRANSITIONS = {
    PENDING: frozenset(
        {
            UNDER_REVIEW,
            REJECTED,
            CANCELLED,
        }
    ),
    UNDER_REVIEW: frozenset(
        {
            APPROVED,
            REJECTED,
        }
    ),
    APPROVED: frozenset(
        {
            WAITING_FOR_PAYMENT,
        }
    ),
    WAITING_FOR_PAYMENT: frozenset(
        {
            PAID,
            PAYMENT_EXPIRED,
            CANCELLED,
        }
    ),
    PAID: frozenset(
        {
            CONFIRMED,
            CANCELLED,
        }
    ),
    CONFIRMED: frozenset(
        {
            READY_FOR_TRAVEL,
            CANCELLED,
        }
    ),
    READY_FOR_TRAVEL: frozenset(
        {
            IN_PROGRESS,
        }
    ),
    IN_PROGRESS: frozenset(
        {
            COMPLETED,
        }
    ),
    COMPLETED: frozenset(),
    REJECTED: frozenset(),
    CANCELLED: frozenset(),
    PAYMENT_EXPIRED: frozenset(),
}
