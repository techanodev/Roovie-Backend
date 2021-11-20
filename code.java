
public class Program {

    public static void main(String[] args) {

        Student stud = new Student();
        Student stud1 = new Student("Kath", 20);
        Student stud2 = new Student("Kath", 20, "Single");

        stud.show();
        stud1.show();
        stud2.show();
    }
}

class Student {
    private String name;
    private int age;
    private String status;

    public Student() {
        name = "No name yet.";
        age = 0;
        status = "None";
    }

    public Student(String name, int Age) {
        this.name = name;
        this.age = Age;

    }

    public Student(String name, int Age, String status) {
        this.name = name;
        this.age = Age;
        this.status = status;

    }

    public void show() {
        System.out.println("\nName: " + name);
        System.out.println("Age: " + age);
        System.out.println("Status: " + status);
    }
}