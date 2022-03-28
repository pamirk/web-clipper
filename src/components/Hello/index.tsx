import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Divider, Input, List, Skeleton } from 'antd';
// @ts-ignore
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTextRazorData } from '@/service/api';
import { ChromeTabService } from '@/service/tab/browser/background/tabService';
import { Tab } from '@/service/common/tab';

const Hello = () => {
  const [isSubmitting, setIsSubmmitting] = useState(false);
  const [tags, setTags] = useState<any>(null);
  const [resData, setResData] = useState<any>(null);
  const [threshold, setThreshold] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setIsSubmmitting(true);
      setError('');
      const chromeTabService = new ChromeTabService();
      const url: Tab = await chromeTabService.getCurrent();
      const data = await getTextRazorData(url.url!)
        .then(res => {
          // message.success("Fetched data");
          return res;
        })
        .catch(ex => setError(ex.message))
        .finally(() => setIsSubmmitting(false));
      if (data && data[0]) {
        setTags(data[0].tags);
        setResData(data[0]);
      }
    })();
  }, []);
  const handleThresholdChange = e => {
    setThreshold(e.target.value);
    setTags(resData.tags.filter(i => i.score >= e.target.value));
  };

  return (
    <div className="text-center col-lg-12">
      {resData ? (
        <div>
          <Input type="number" placeholder="Threshold Frequency" onChange={handleThresholdChange} />
          {tags && (
            <Badge.Ribbon text={`${tags.length} Tags`}>
              <div
                id="scrollableDiv"
                style={{
                  height: '20vh',
                  overflow: 'auto',
                  padding: '0 16px',
                  border: '1px solid rgba(140, 140, 140, 0.35)',
                  margin: '20px auto',
                }}
              >
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <InfiniteScroll
                  hasMore={false}
                  dataLength={tags.length}
                  loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                  endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={tags}
                    renderItem={(item: any) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{
                                color: '#f56a00',
                                backgroundColor: '#fde3cf',
                              }}
                            >
                              {item.score.toFixed(2)}
                            </Avatar>
                          }
                          title={item.label}
                          description=""
                        />
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </Badge.Ribbon>
          )}
        </div>
      ) : (
        'Loading'
      )}
    </div>
  );
};

export default Hello;
