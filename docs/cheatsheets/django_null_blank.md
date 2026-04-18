# 🛡️ Django `null` vs. `blank` Cheat Sheet

### The Core Definitions

Always remember which layer you are talking to:

- **`null=True` talks to the Database.** It allows the column to store a `NULL` value.
- **`blank=True` talks to Django.** It allows forms, serializers, and `full_clean()` to pass validation if the field is empty.

---

### 🚦 The Quick Reference Matrix

| Field Type                                                                          | How to make it optional     | Example                                                                                  |
| :---------------------------------------------------------------------------------- | :-------------------------- | :--------------------------------------------------------------------------------------- |
| **Strings**<br>`CharField`, `TextField`, `EmailField`, `URLField`                   | **`blank=True` ONLY**       | `bio = models.TextField(blank=True)`                                                     |
| **Numbers & Dates**<br>`IntegerField`, `DecimalField`, `DateField`, `DateTimeField` | **Both**                    | `age = models.IntegerField(null=True, blank=True)`                                       |
| **Relationships**<br>`ForeignKey`, `OneToOneField`                                  | **Both**                    | `company = models.ForeignKey(Company, null=True, blank=True, on_delete=models.SET_NULL)` |
| **Files & Images**<br>`FileField`, `ImageField`                                     | **`blank=True` ONLY**       | `avatar = models.ImageField(blank=True)`                                                 |
| **Many-to-Many**<br>`ManyToManyField`                                               | **`blank=True` ONLY**       | `tags = models.ManyToManyField(Tag, blank=True)`                                         |
| **Booleans**<br>`BooleanField`                                                      | **See special rules below** | `is_active = models.BooleanField(default=True)`                                          |

---

### ⚠️ Special Rules & Gotchas

#### 1. Why no `null=True` on Strings?

If you put `null=True` on a CharField, you create **two** ways for the database to represent "no data": `NULL` and `""` (empty string). Django prefers empty strings. Sticking to `blank=True` keeps your queries clean: `User.objects.filter(bio="")`.

#### 2. The Boolean Exception

A standard `BooleanField` should usually have a `default` instead of being optional:

- **Standard:** `is_active = models.BooleanField(default=True)`
- **3-State Boolean:** If you truly need a "Yes", "No", and "Unknown/Not Answered" state, then use **both**: `has_pets = models.BooleanField(null=True, blank=True)`.

#### 3. The ManyToMany Exception

`null=True` does absolutely nothing on a `ManyToManyField`. This is because a M2M relationship isn't a column on your table; it's a completely separate mapping table. To make a M2M optional in forms/serializers, just use `blank=True`.

#### 4. The ForeignKey "CASCADE" Trap

If you make a `ForeignKey` optional (`null=True`), you **must** think about the `on_delete` behavior. You almost always want `models.SET_NULL` instead of `models.CASCADE`.
_(e.g., If a User's optional "Company" is deleted, you don't want to delete the User! You just want to set their company field back to NULL)._
