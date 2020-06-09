FROM debian:stable

MAINTAINER David Moreno <dmoreno@bitergia.com>
# Image for developing Kibiter/Kibana

# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 10.15.2

# add our user and group first to make sure their IDs get assigned consistently
RUN groupadd --system kibana && \
    useradd --system --create-home --gid kibana kibana

# backports used to install java 8 needed by elasticsearch 5
# ruby gems are used for building binary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
            ca-certificates dirmngr gnupg \
            curl \
            wget \
            unzip \
            git \
            python \
            zip \
            make \
            g++ \
            ruby-dev rpm rubygems \
            libffi-dev
    # Install nvm and npm 
RUN curl -o /tmp/nvm-install.sh -sSL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh && \
    chmod +x /tmp/nvm-install.sh && \
    bash -c /tmp/nvm-install.sh && \
    . /root/.bashrc && \
    nvm install $NODE_VERSION
    # add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
    # Install kibiter
    # gems needed in Kibana > 5.x to build binary packages
RUN gem install rake && \
    gem install ffi && \
    gem install fpm -v 1.5.0 && \
    gem install pleaserun -v 0.0.24
    # Download Kibiter release
RUN curl -o /tmp/kibiter-6.8.6-linux-x86_64-3.tar.gz -sSL https://github.com/chaoss/grimoirelab-kibiter/releases/download/community-v6.8.6-3/kibiter-6.8.6-linux-x86_64-3.tar.gz && \
    tar xfz /tmp/kibiter-6.8.6-linux-x86_64-3.tar.gz --directory /opt && \
    mv /opt/kibiter-6.8.6-linux-x86_64 /opt/kibana && \
    chown -R kibana:kibana /opt/kibana
    # Install dotplot plugin: https://github.com/dlumbrer/kbn_dotplot
RUN cd /opt/kibana/plugins && \
    git clone https://github.com/dlumbrer/kbn_dotplot.git -b 6-dev && \
    cd kbn_dotplot && \
    npm install
    # Install polar plugin: https://github.com/dlumbrer/kbn_polar
RUN cd /opt/kibana/plugins && \
    git clone https://github.com/dlumbrer/kbn_polar.git -b 6-dev && \
    cd kbn_polar && \
    npm install
    # Install radar plugin: https://github.com/dlumbrer/kbn_radar
RUN cd /opt/kibana/plugins && \
    git clone https://github.com/dlumbrer/kbn_radar.git -b 6-dev && \
    cd kbn_radar && \
    npm install
    # Install network plugin: https://dlumbrer.github.io/kbn_network/
RUN cd /opt/kibana/plugins && \
    git clone https://github.com/dlumbrer/kbn_network.git network_vis -b 6-dev && \
    cd network_vis && \
    npm install
    # Install kibana-enchanced table plugin: https://github.com/fbaligand/kibana-enhanced-table
RUN cd /opt/kibana && \
    ./bin/kibana-plugin install https://github.com/fbaligand/kibana-enhanced-table/releases/download/v1.8.0/enhanced-table-1.8.0_6.8.6.zip && \
    cd /root
    # cleanup to thin the final image
RUN rm -rf /kibiter && \
    apt-get purge -y g++ git make python zip wget && \
    apt-get autoremove --purge -y && \
    apt-get clean && \
    find /var/lib/apt/lists -type f -delete && \
    rm -rf /root/.npm /root/.node-gyp /root/.nvm /tmp/* /var/tmp/* && \
    bash -c 'find /usr/share/locale -maxdepth 1 -mindepth 1 -type d | grep -v -e "en_US" | xargs rm -rfv' && \
    bash -c 'localedef --list-archive | grep -v -e "en_US" | xargs localedef --delete-from-archive' && \
    rm -rf /usr/share/doc/*

# grab gosu for easy step-down from root
RUN ( gpg --batch --keyserver hkps://hkps.pool.sks-keyservers.net  --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
     || gpg --batch --keyserver pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \ 
     || gpg --batch --keyserver hkp://keys.gnupg.net:80  --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 )
RUN arch="$(dpkg --print-architecture)" \
	&& set -x \
	&& curl -o /usr/local/bin/gosu -sSL "https://github.com/tianon/gosu/releases/download/1.3/gosu-$arch" \
	&& curl -o /usr/local/bin/gosu.asc -sSL "https://github.com/tianon/gosu/releases/download/1.3/gosu-$arch.asc" \
	&& gpg --verify /usr/local/bin/gosu.asc \
	&& rm /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu

ENV PATH /opt/kibana/bin:$PATH

# Remove kibana optimize so it is regenerated when we modify src files in containers
# Don't delete because we don't modify anymore src in docker-entrypoint.sh
RUN rm -rf /opt/kibana/optimize/*
RUN cat /opt/kibana/config/kibana.yml

RUN ./opt/kibana/bin/kibana | sleep 200 > /tmp/run_kibana_log.txt

COPY ./docker_entrypoint.sh /
RUN ["chmod", "+x", "/docker_entrypoint.sh"]

EXPOSE 5601
ENTRYPOINT ["/docker_entrypoint.sh"]
CMD ["kibana"]
