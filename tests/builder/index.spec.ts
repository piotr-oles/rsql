import builder from "@rsql/builder";
import { emit } from "@rsql/emitter";

describe("builder", () => {
  it("creates 1 level depth query", () => {
    const ast = builder.and(
      builder.eq("user.id", "1884"),
      builder.ge("user.name", "John"),
      builder.in("user.role", ["Admin", "Moderator"])
    );

    expect(emit(ast)).toEqual("user.id==1884;user.name>=John;user.role=in=(Admin,Moderator)");
  });

  it("creates 2 level depth query", () => {
    const ast = builder.and(
      builder.eq("user.id", "1884"),
      builder.ge("user.name", "John"),
      builder.or(builder.eq("user.superAdmin", "true"), builder.in("user.role", ["Admin", "Moderator"]))
    );

    expect(emit(ast)).toEqual("user.id==1884;user.name>=John;(user.superAdmin==true,user.role=in=(Admin,Moderator))");
  });

  it("composes queries", () => {
    const astA = builder.and(builder.eq("user.id", "1884"), builder.ge("user.name", "John"));
    const astB = builder.or(builder.ge("user.name", "John"), builder.in("user.role", ["Admin", "Moderator"]));
    const ast = builder.and(astA, astB);

    expect(emit(ast)).toEqual("user.id==1884;user.name>=John;(user.name>=John,user.role=in=(Admin,Moderator))");
  });

  it("creates query for string or numbers", () => {
    const ast = builder.and(builder.eq("user.id", 123), builder.in("user.category", [10, "40"]));

    expect(emit(ast)).toEqual("user.id==123;user.category=in=(10,40)");
  });
});
