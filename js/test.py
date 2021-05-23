def feePaymentDate(courseMonth, feeDate):
    if len(courseMonth) != 5:
        print('Invalid Input')
        return
    
    cm = 0
    cy = 0
    fd = 0
    fm = 0
    fy = 0
    try:
        cm = int(courseMonth[:2])
        cy = int(courseMonth[3:])

        fd = int(feeDate[:2])
        fm = int(feeDate[3:5])
        fy = int(feeDate[6:])
    except ValueError:
        print('Invalid Input')
        return

    days = [31,28,31,30,31,30,31,31,30,31,30,31]

    # TODO: February Leap Year

    # Case where date doesn't exist.
    if fd > days[fm - 1]:
        print('Invalid Input')
        return
    
    # All invalid cases done.

    # Match formats
    fy = fy % 100

    # Case where fees not paid in same month.
    if fm != cm or fy != cy:
        print('0')
        print('No')
        return

    # Case where fees paid.
    days_late = max(fd - 20, 0)
    late_fee = days_late * 100
    total_fee = 5000 + late_fee
    print(total_fee)
    print('Yes')








a = input()
b = input()

feePaymentDate(a, b)