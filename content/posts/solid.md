+++
date = '2026-07-19T21:30:00+05:30'
draft = false
title = "SOLID Principles: The Five Rules That Will Save You From Writing Code You Hate"
author = "Dheeraj"
tags = ["software engineering"]
+++

You know that feeling when you open a project you wrote six months ago?

You stare at the code for a minute and think,

> "Who on earth wrote this?"

Then you check the Git history.

It was you.

We've all had that moment.

The funny thing is that the code usually *works*. It runs perfectly fine. The problem starts when someone asks you to add one tiny feature. Suddenly you're changing five different files, something completely unrelated breaks, and now you're afraid to touch anything because it feels like the whole project is held together by hope.

If that sounds familiar, you're not a bad programmer.

You just haven't met SOLID yet.

Despite the fancy name, SOLID isn't some magical framework or something only senior engineers use. It's simply five design principles that help you write software that's easier to understand, easier to extend, and much harder to accidentally break.

The best part?

Once you understand *why* these principles exist, you'll start noticing them everywhere. You'll look at your old projects and immediately spot where things went wrong.

So instead of memorizing definitions like we're preparing for an exam, let's build something together.

Imagine we're building a restaurant management system.

We'll keep coming back to this restaurant throughout the article, because trust me, by the end of it you'll never forget what SOLID stands for.

# S stands for Single Responsibility Principle

The official definition says,

> A class should have one, and only one, reason to change.

Sounds simple enough.

But what does that actually mean?

Let's forget code for a second.

Imagine walking into a restaurant where one person is doing everything.

They're taking orders.

Cooking food.

Washing dishes.

Generating bills.

Cleaning tables.

Answering customer calls.

Even fixing the WiFi when it stops working.

That restaurant wouldn't survive a week.

Not because the employee is bad.

Because no one should be responsible for everything.

Yet this is exactly what beginners (including me) do with classes.

```python
class Restaurant:

    def cook_food(self):
        ...

    def generate_bill(self):
        ...

    def send_email(self):
        ...

    def save_to_database(self):
        ...

    def print_sales_report(self):
        ...
```

At first glance this doesn't seem terrible.

But imagine tomorrow the tax rules change.

You edit this class.

Next week you decide to switch from PostgreSQL to MongoDB.

You edit the same class.

A month later your email template changes.

Again...

The same class.

Notice the pattern?

This class has way too many reasons to change.

Instead, split the responsibilities.

```python
class Chef:
    def cook(self):
        ...


class BillingService:
    def generate_bill(self):
        ...


class EmailService:
    def send_receipt(self):
        ...


class RestaurantRepository:
    def save(self):
        ...
```

Now each class has one clear responsibility.

If billing changes, you know exactly where to look.

If the database changes, you aren't touching your email code.

Life suddenly becomes much simpler.

A good question I like asking myself is this:

> "If I had to hire employees for this class, how many job titles would they have?"

If the answer is more than one, your class probably has too many responsibilities.

# O stands for Open Closed Principle

This one confused me the first time I heard it.

How can something be open and closed at the same time?

The definition is:

> Open for extension, closed for modification.

Let's use payments as an example.

Your restaurant initially accepts only cash.

```python
def pay(method):

    if method == "cash":
        print("Cash payment successful")
```

Everything works.

Then customers ask for card payments.

So you modify the function.

A few weeks later everyone starts paying with UPI.

Modify it again.

Then someone wants PayPal.

Modify it again.

Then Apple Pay.

Then Google Pay.

Eventually your function starts looking like this.

```python
if method == "cash":
    ...

elif method == "card":
    ...

elif method == "upi":
    ...

elif method == "paypal":
    ...

elif method == "applepay":
    ...

elif method == "googlepay":
    ...
```

Every new payment method forces you to reopen old code.

That's risky.

What if you accidentally break cash payments while adding UPI?

Instead, think differently.

```python
class Payment:

    def pay(self):
        pass


class Cash(Payment):

    def pay(self):
        print("Cash payment")


class Card(Payment):

    def pay(self):
        print("Card payment")
```

Now your checkout doesn't care how someone pays.

```python
def checkout(payment: Payment):
    payment.pay()
```

Tomorrow someone invents the next revolutionary payment system.

You don't touch `checkout()`.

You simply create another class.

That's it.

You're extending the application instead of modifying existing code.

That's the entire principle.

# L stands for Liskov Substitution Principle

If there's one principle people memorize without actually understanding, it's this one.

Even the name sounds intimidating.

But the idea is surprisingly simple.

Suppose I tell you,

"Bring me any bird."

You bring a pigeon.

Great.

You bring a sparrow.

Also fine.

Then you bring a penguin.

Still a bird, right?

Now imagine my program assumes every bird can fly.

```python
class Bird:

    def fly(self):
        print("Flying")
```

Then someone creates this.

```python
class Penguin(Bird):

    def fly(self):
        raise Exception("Penguins can't fly")
```

Now somewhere else in the application...

```python
bird = Penguin()
bird.fly()
```

Crash.

The parent class made a promise.

The child class broke it.

That's exactly what Liskov Substitution is trying to prevent.

If a class inherits from another class, it should behave in a way that doesn't surprise the rest of the program.

A better design would be this.

```python
class Bird:
    pass


class FlyingBird(Bird):

    def fly(self):
        ...


class Penguin(Bird):

    def swim(self):
        ...
```

Now nobody expects penguins to fly.

No broken promises.

No weird exceptions.

# I stands for Interface Segregation Principle

This one sounds complicated.

It's actually something you've probably experienced outside programming.

Imagine buying a TV remote.

All you want is to turn the TV on, change channels, and adjust the volume.

Instead, the remote has 94 buttons.

Half of them control features you've never even heard of.

You spend five minutes trying to find the volume button.

That's a bad interface.

Software can have the same problem.

```python
class Worker:

    def code(self):
        ...

    def design(self):
        ...

    def cook(self):
        ...

    def clean(self):
        ...
```

Now imagine you're creating a backend developer.

Why should they implement `cook()`?

It makes no sense.

Instead, keep interfaces small and focused.

```python
class Coder:

    def code(self):
        ...


class Designer:

    def design(self):
        ...
```

Each class only implements what it actually needs.

No unnecessary methods.

No empty functions.

No exceptions saying "Not Implemented."

If you're forcing a class to implement methods it never uses, it's usually a sign your interface is trying to do too much.

# D stands for Dependency Inversion Principle

This is probably my favorite one because once it clicks, you'll start seeing it everywhere.

Let's go back to our restaurant.

Suppose your restaurant hires an Italian chef.

```python
class ItalianChef:

    def cook(self):
        print("Pasta")
```

Then your restaurant looks like this.

```python
class Restaurant:

    def __init__(self):
        self.chef = ItalianChef()
```

Everything works.

Until your chef resigns.

Now your restaurant is tightly coupled to one specific chef.

Instead, depend on the role.

Not the person.

```python
class Chef:

    def cook(self):
        pass
```

Now anyone can become the chef.

```python
class ItalianChef(Chef):

    def cook(self):
        print("Pasta")


class IndianChef(Chef):

    def cook(self):
        print("Biryani")
```

Your restaurant changes slightly.

```python
class Restaurant:

    def __init__(self, chef: Chef):
        self.chef = chef

    def serve(self):
        self.chef.cook()
```

Today's chef could be Italian.

Tomorrow it could be Indian.

Next week it could be Mexican.

The restaurant doesn't care.

It only knows one thing.

"I need someone who can cook."

That's Dependency Inversion.

Depend on abstractions.

Not concrete implementations.

If that sentence ever confuses you, just remember the restaurant hiring a **Chef**, not hiring **John**.

# So... do I need to use SOLID everywhere?

No.

If you're writing a quick Python script that renames a hundred files, applying all five principles would probably make the solution longer than the problem itself.

SOLID starts becoming valuable when your software grows.

When there are multiple developers.

When features keep getting added.

When requirements change every week.

That's when these principles quietly save you from turning your project into a giant ball of spaghetti.

They're not rules.

They're guidelines.

Sometimes you'll follow every single one.

Sometimes you'll intentionally break one because the simpler solution is actually the better solution.

That's completely fine.

The goal isn't to impress other developers.

The goal is to make your code easier to work with.

# Final Thoughts

The biggest lesson I learned from SOLID wasn't how to write "better" code.

It was learning that good software isn't about being clever.

It's about being predictable.

When someone opens your code six months later, they shouldn't have to solve a mystery.

They should be able to look at a class and immediately understand what it does.

They should be able to add a feature without worrying about breaking something on the other side of the project.

And most importantly...

Future you should be thankful that past you cared enough to keep things simple.

Because sooner or later, you'll open one of your old projects again.

When that day comes, I hope your first thought isn't,

> "Who wrote this mess?"

I hope it's,

> "Oh... this actually makes sense."