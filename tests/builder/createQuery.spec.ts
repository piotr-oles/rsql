import { createQuery } from "@rsql/builder";

describe("createQuery", () => {
  it("creates 1 level depth query", () => {
    const query = createQuery()
      .and()
      .eq("user.id", "1884")
      .ge("user.name", "John")
      .in("user.role", ["Admin", "Moderator"])
      .end();

    expect(query.toString()).toEqual("user.id==1884;user.name>=John;user.role=in=(Admin,Moderator)");
  });

  it("creates 2 level depth query", () => {
    const query = createQuery()
      .and()
      .eq("user.id", "1884")
      .ge("user.name", "John")
      .or()
      .eq("user.superAdmin", "true")
      .in("user.role", ["Admin", "Moderator"])
      .end()
      .end();

    expect(query.toString()).toEqual(
      "user.id==1884;user.name>=John;(user.superAdmin==true,user.role=in=(Admin,Moderator))"
    );
  });

  it("composes queries", () => {
    const queryA = createQuery().and().eq("user.id", "1884").ge("user.name", "John").end();
    const queryB = createQuery().or().ge("user.name", "John").in("user.role", ["Admin", "Moderator"]).end();

    const query = createQuery().and(queryA).and(queryB);

    expect(query.toString()).toEqual("user.id==1884;user.name>=John;(user.name>=John,user.role=in=(Admin,Moderator))");
  });
});
