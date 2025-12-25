import { useMemo } from "react";

import { NavBar } from "../../layout/navBar";
import Footer from "../../layout/footer";
import { LogoAndButton } from "../../components/LogoAndButton";
import { ModalTeacher } from "../../components/modalTeacher";
import { Containers } from "../../components/Container";
import { useApi } from "../../hooks/useApi";
import { API_URL } from "../../config";

import { Card, Content, Cover, Grid, Header, Page } from "./style";

const News = () => {
  const { data: news, isLoading } = useApi(`${API_URL}/news`);

  const items = useMemo(() => (Array.isArray(news) ? news : []), [news]);

  return (
    <Page>
      <ModalTeacher isOpen="true" />
      <LogoAndButton />
      <NavBar />

      <Containers>
        <Header>
          <h1>آخر الأخبار</h1>
          <p>إعلانات وتحديثات المنصة</p>
        </Header>

        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : items.length === 0 ? (
          <p>لا يوجد أخبار حالياً.</p>
        ) : (
          <Grid>
            {items.map((n) => (
              <Card key={n._id}>
                <Cover>
                  {n.coverImage ? (
                    <img src={n.coverImage} alt={n.title} />
                  ) : (
                    <img src="/assets/img/logo.png" alt="News" />
                  )}
                </Cover>
                <Content>
                  <h3>{n.title}</h3>
                  <div className="meta">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}
                  </div>
                  <div className="body">
                    {String(n.body || "").length > 220 ? `${n.body.slice(0, 220)}...` : n.body}
                  </div>
                </Content>
              </Card>
            ))}
          </Grid>
        )}
      </Containers>

      <Footer />
    </Page>
  );
};

export default News;
