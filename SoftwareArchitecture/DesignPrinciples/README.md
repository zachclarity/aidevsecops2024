TDB ....
Here are the SOLID key software design principles along with example use case diagrams:

<a href="https://github.com/arslanaybars/solid.practices">Example Repo with code samples.</a>
<hr/>

1. Single Responsibility Principle (SRP)
   - A class should have only one reason to change.
   - Example: A class that handles user authentication should not also handle user profile management.

   Use Case Diagram:
   ```
   +----------------+
   |     User       |
   +----------------+
        |     |
        |     |
   +---------+ +---------+
   |  Login  | | Logout  |
   +---------+ +---------+
   ```

2. Open-Closed Principle (OCP)
   - Software entities should be open for extension but closed for modification.
   - Example: A payment processing system should allow adding new payment gateways without modifying existing code.

   Use Case Diagram:
   ```
   +----------------+
   |     User       |
   +----------------+
        |
        |
   +-----------------+
   | Process Payment |
   +-----------------+
        |
        |
   +------------------------+
   | Payment Gateway        |
   +------------------------+
   | + processPayment()     |
   +------------------------+
        ^
        |
   +---------------------+
   | CreditCardPayment   |
   +---------------------+
   | + processPayment()  |
   +---------------------+
   ```

3. Liskov Substitution Principle (LSP)
   - Subtypes must be substitutable for their base types.
   - Example: If a function accepts a base class object, it should also work correctly with objects of derived classes.

   Use Case Diagram:
   ```
   +----------------+
   |     User       |
   +----------------+
        |
        |
   +-------------------+
   | Withdraw Money    |
   +-------------------+
        |
        |
   +------------------------+
   | BankAccount            |
   +------------------------+
   | + withdraw()           |
   +------------------------+
        ^
        |
   +---------------------+
   | SavingsAccount      |
   +---------------------+
   | + withdraw()        |
   +---------------------+
   ```

4. Interface Segregation Principle (ISP)
   - Clients should not be forced to depend on interfaces they do not use.
   - Example: Instead of having a single large interface, create smaller, focused interfaces.

   Use Case Diagram:
   ```
   +----------------+
   |     User       |
   +----------------+
        |     |
        |     |
   +---------+ +---------+
   |  Print   | |  Scan   |
   +---------+ +---------+
        |           |
        |           |
   +-------------+ +-------------+
   | Printable   | | Scannable   |
   +-------------+ +-------------+
   | + print()   | | + scan()    |
   +-------------+ +-------------+
   ```

5. Dependency Inversion Principle (DIP)
   - High-level modules should not depend on low-level modules. Both should depend on abstractions.
   - Example: Use dependency injection to provide dependencies to a class instead of creating them directly.

   Use Case Diagram:
   ```
   +----------------+
   |     User       |
   +----------------+
        |
        |
   +-------------------+
   | Send Notification |
   +-------------------+
        |
        |
   +------------------------+
   | NotificationService    |
   +------------------------+
   | + sendNotification()   |
   +------------------------+
        ^
        |
   +---------------------+
   | EmailNotification   |
   +---------------------+
   | + sendNotification()|
   +---------------------+
   ```

These diagrams provide a visual representation of the use cases and the relationships between classes or components based on the software design principles. They help in understanding how the principles can be applied in real-world scenarios.